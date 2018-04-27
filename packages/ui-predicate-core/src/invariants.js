/**
 * Invariants
 * @namespace invariants
 * @since 1.0.0
 * @note invariants are 100% tested from PredicateCore.test.js
 */

const { is } = require('ramda');

module.exports = ({ errors, rules }) => ({
  /**
   * [CompoundPredicateMustHaveAtLeastOneSubPredicate description]
   * @param {?Array<Predicate>} predicates list of predicates to add to a CompoundPredicate at creation time
   * @return {Promise<undefined, errors.CompoundPredicateMustHaveAtLeastOneSubPredicate>} resolve the promise if the invariant pass or yield a `CompoundPredicateMustHaveAtLeastOneSubPredicate` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  CompoundPredicateMustHaveAtLeastOneSubPredicate: predicates => {
    if (!Array.isArray(predicates) || predicates.length === 0) {
      return Promise.reject(
        new errors.CompoundPredicateMustHaveAtLeastOneSubPredicate()
      );
    }
    return Promise.resolve();
  },

  /**
   * @param {String} type Predicate type
   * @param {Object} acceptedTypes list of accepted types
   * @return {Promise<undefined, errors.InvalidPredicateType>} resolve the promise if the invariant pass or yield a `InvalidPredicateType` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  PredicateTypeMustBeValid: (type, acceptedTypes) => {
    if (!Object.keys(acceptedTypes).includes(type)) {
      return Promise.reject(new errors.InvalidPredicateType());
    }

    return Promise.resolve();
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @return {Promise<dataclasses.CompoundPredicate, errors.RootPredicateMustBeACompoundPredicate>} resolve the promise if the invariant pass or yield a `RootPredicateMustBeACompoundPredicate` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  RootPredicateMustBeACompoundPredicate: (root, CompoundPredicate) => {
    if (!CompoundPredicate.is(root)) {
      return Promise.reject(new errors.RootPredicateMustBeACompoundPredicate());
    }
    return Promise.resolve(root);
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @return {Promise<undefined, errors.PredicateMustBeAComparisonPredicate>} resolve the promise if the invariant pass or yield a `PredicateMustBeAComparisonPredicate` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  PredicateMustBeAComparisonPredicate: root => {
    if (!is(Object, root) || root.$_type !== 'ComparisonPredicate') {
      // @todo use ComparisonPredicate.is instead
      return Promise.reject(new errors.PredicateMustBeAComparisonPredicate());
    }
    return Promise.resolve();
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @return {Promise<undefined, errors.AddCurrentlyOnlySupportAfterInsertion>} resolve the promise if the invariant pass or yield a `AddCurrentlyOnlySupportAfterInsertion` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  AddOnlySupportsAfter: how => {
    if (how !== 'after') {
      return Promise.reject(new errors.AddCurrentlyOnlySupportAfterInsertion());
    }

    return Promise.resolve();
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @return {Promise<dataclasses.Type, errors.TargetMustReferToADefinedType>} resolve the promise if the invariant pass or yield a `TargetMustReferToADefinedType` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  TargetMustReferToADefinedType: (type, target) => {
    if (type.isNone()) {
      return Promise.reject(
        new errors.TargetMustReferToADefinedType(
          `target ${JSON.stringify(
            target.target_id
          )} does not refer to a defined type, target.type_id=${JSON.stringify(
            target.type_id
          )}`
        )
      );
    }
    return Promise.resolve(type.value());
  },

  /**
   * @param {Option<dataclasses.Target>} target target
   * @return {Promise<dataclasses.Target, errors.Target_idMustReferToADefinedTarget>} resolve the promise if the invariant pass or yield a `Target_idMustReferToADefinedTarget` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  Target_idMustReferToADefinedTarget: target => {
    if (target.isNone()) {
      return Promise.reject(new errors.Target_idMustReferToADefinedTarget());
    }
    return Promise.resolve(target);
  },

  /**
   * @param {Option<dataclasses.Operator>} operator
   * @return {Promise<dataclasses.Operator, errors.Operator_idMustReferToADefinedOperator>} resolve the promise if the invariant pass or yield a `Operator_idMustReferToADefinedOperator` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  Operator_idMustReferToADefinedOperator: operator => {
    if (operator.isNone()) {
      return Promise.reject(
        new errors.Operator_idMustReferToADefinedOperator()
      );
    }
    return Promise.resolve(operator);
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @param {dataclasses.Predicate} predicateToRemove predicateToRemove
   * @return {Promise<predicateToRemove, errors.ForbiddenCannotRemoveRootCompoundPredicate>} resolve the promise if the invariant pass or yield a `ForbiddenCannotRemoveRootCompoundPredicate` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  RemovePredicateMustDifferFromRootPredicate: (root, predicateToRemove) => {
    if (rules.predicateToRemoveIsRootPredicate(root, predicateToRemove)) {
      return Promise.reject(
        new errors.ForbiddenCannotRemoveRootCompoundPredicate()
      );
    }

    return Promise.resolve(predicateToRemove);
  },

  /**
   * @param {dataclasses.CompoundPredicate} root root
   * @param {dataclasses.Predicate} predicateToRemove
   * @param {dataclasses.CompoundPredicate} CompoundPredicate
   * @param {dataclasses.ComparisonPredicate} ComparisonPredicate
   * @return {Promise<undefined, errors.ForbiddenCannotRemoveLastComparisonPredicate>} resolve the promise if the invariant pass or yield a `RootPredicateMustBeACompoundPredicate` error otherwise
   * @memberof invariants
   * @since 1.0.0
   */
  RemovePredicateCannotBeTheLastComparisonPredicate: (
    root,
    predicateToRemove,
    CompoundPredicate,
    ComparisonPredicate
  ) => {
    if (
      ComparisonPredicate.is(predicateToRemove) &&
      rules.predicateToRemoveIsTheLastComparisonPredicate(
        root,
        CompoundPredicate,
        ComparisonPredicate
      )
    ) {
      return Promise.reject(
        new errors.ForbiddenCannotRemoveLastComparisonPredicate()
      );
    }

    return Promise.resolve();
  },
});
